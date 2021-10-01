import {
  BodyParams,
  Controller,
  Delete,
  Get,
  PathParams,
  Post,
  Put,
  Req,
} from "@tsed/common";
import { Authorize } from "@tsed/passport";
import {
  Description,
  Groups,
  Required,
  Returns,
  Security,
  Status,
  Summary,
} from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { Course } from "src/models/courses/Course";
import { CoursesService } from "src/services/CoursesService";
import { UsersService } from "src/services/UsersService";

@Controller("/courses")
export class CoursesController {
  constructor(
    private coursesService: CoursesService,
    private usersService: UsersService
  ) {}

  @Get("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Courses")
  @Returns(200, Course)
  async getAllCourses(@Req() request: Req): Promise<Course[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.coursesService.query(query);
  }

  @Get("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Course based on id")
  @Returns(200, Course)
  async getCourse(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Course | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.coursesService.find(id);
  }

  @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Course")
  @Returns(201, Course)
  async createCourse(
    @Req() request: Req,
    @Description("Course model")
    @BodyParams()
    @Groups("creation")
    data: Course
  ): Promise<Course> {
    const user = await this.usersService.find(data.createdBy.toString());
    if (!user || user.role === "superadmin") {
      throw new Error(
        `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }
    return this.coursesService.save(data, {
      role: user.role,
      _id: user._id,
      adminId: user.adminId,
    });
  }

  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Course with id")
  @Status(201, { description: "Updated Course", type: Course })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() Course: Course
  ): Promise<Course | null> {
    return this.coursesService.update(id, Course);
  }

  @Delete("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Course")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.coursesService.remove(id);
  }
}
