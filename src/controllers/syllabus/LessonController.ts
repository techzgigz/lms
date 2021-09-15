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
  Status,
  Summary,
  Security,
 
} from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { Lesson } from "src/models/syllabus/Lesson";
import { LessonService } from "src/services/LessonService";
import { User } from "src/models/users/User";
import { UsersService } from "src/services/UsersService";
import * as multer from 'multer'

@Controller("/lesson")
export class LessonController {
  constructor(private lessonService: LessonService,
    private usersService: UsersService
    ) { }

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Lesson")
  @Returns(200, Lesson)
  async getAllLesson(@Req() request: Req): Promise<Lesson[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions.readIds };
    }
    return this.lessonService.query(query);
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Lesson based on id")
  @Returns(200, Lesson)
  async getLesson(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Lesson | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions.readIds.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.lessonService.find(id);
  }

  @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new lesson")
  @Returns(201, Lesson)
  async createLesson(
    @Req() request: Req,
    @Description("Lesson model")
    @BodyParams()
    @Groups("creation")
    data: Lesson
  ): Promise<Lesson> {

    const user = await this.usersService.find(data.createdBy.toString());
    if (!user) {
      throw new Error(
        `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }


    return this.lessonService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }
  

  
  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update lesson with id")
  @Status(201, { description: "Updated lesson", type: Lesson})
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() lesson: Lesson
  ): Promise<Lesson| null> {
    return this.lessonService.update(id, lesson);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Lesson")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.lessonService.remove(id);
  }
}
