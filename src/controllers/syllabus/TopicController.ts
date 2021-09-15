import {
  BodyParams,
  Controller,
  Delete,
  Get,
  PathParams,
  Post,
  Put,
  Req,
  Use,
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
import { Topic } from "src/models/syllabus/Topic";
import { TopicService } from "src/services/TopicService";
import { UsersService } from "src/services/UsersService";
import { UploadMiddleware } from "src/middlewares/FileUpload";
@Controller("/topic")
export class TopicController {
  constructor(private topicService: TopicService,
    private usersService: UsersService) { }

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Topic")
  @Returns(200, Topic)
  async getAllTopic(@Req() request: Req): Promise<Topic[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions.readIds };
    }
    return this.topicService.query(query);
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Topic based on id")
  @Returns(200, Topic)
  async getTopic(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Topic | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.topicService.find(id);
  }

  @Post("/")
  // @Use(UploadMiddleware)
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Topic")
  @Returns(201, Topic)
  async createSubject(
    @Req() request: Req,
    @Description("Topic model")
    @BodyParams()
    @Groups("creation")
    data: Topic
  ): Promise<Topic> {

    const user = await this.usersService.find(data.createdBy.toString());
    if (!user) {
      throw new Error(
        `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }
    return this.topicService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }

  @Put("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Topic with id")
  @Status(201, { description: "Updated Topic", type: Topic})
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() @Groups('updation') topic: Topic
  ): Promise<Topic | null> {
    return this.topicService.update(id, topic);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Topic")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.topicService.remove(id);
  }
}
