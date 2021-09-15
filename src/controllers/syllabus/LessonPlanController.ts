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
  Security
} from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import{ LessonPlan } from "src/models/syllabus/LessonPlan";
import { LessonPlanService } from "src/services/LessonPlanService";
import { UsersService } from "src/services/UsersService";

import { User } from "src/models/users/User";
// import { UsersService } from "src/services/UsersService";
import * as multer from 'multer'
@Controller("/lessonPlan")
export class LessonPlanController {
  constructor(private lessonPlanService: LessonPlanService,private UsersService: UsersService) {}

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all LessonPlan")
  @Returns(200, LessonPlan)
  async getAllLessonPlan(@Req() request: Req): Promise<LessonPlan[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions.readIds };
    }
    return this.lessonPlanService.query(query);
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return LessonPlan based on id")
  @Returns(200, LessonPlan)
  async getLessonPlan(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<LessonPlan | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.lessonPlanService.find(id);
  }

 
  @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new lessonPlan")
  @Returns(201, LessonPlan)
  async createLessonPlan(
    @Req() request: Req,
    @Description("LessonPlan model")
    @BodyParams()
    @Groups("creation")
    data: LessonPlan
  ): Promise<LessonPlan> {

    const user = await this.UsersService.find(data.createdBy.toString());
    if (!user) {
      throw new Error(
        `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }
    return this.lessonPlanService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }

  @Put("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update LessonPlan with id")
  @Status(201, { description: "Updated LessonPlan", type: LessonPlan})
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() @Groups('updation') Lesson: LessonPlan
  ): Promise<LessonPlan | null> {
    return this.lessonPlanService.update(id, Lesson);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a LessonPlan")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.lessonPlanService.remove(id);
  }
}
