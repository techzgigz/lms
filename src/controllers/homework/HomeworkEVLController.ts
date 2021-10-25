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
import { HomeworkEVL } from "src/models/homework/HomeworkEVL";//
import { HomeworkEVLService } from "src/services/HomeworkEVLService";//
import { User } from "src/models/users/User";
import { UsersService } from "src/services/UsersService";

@Controller("/Homework")//
export class HomeworkController {
  constructor(private homeworkEVLservice: HomeworkEVLService,//
    private usersService: UsersService
    ) { }

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Homework")
  @Returns(200, HomeworkEVL)
  async getAllHomeworkEVL(@Req() request: Req): Promise<HomeworkEVL[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions.readIds };
    }
    return this.homeworkEVLservice.query(query);
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return homework based on id")
  @Returns(200, HomeworkEVL)
  async getHomework(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<HomeworkEVL | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.homeworkEVLservice.find(id);
  }

  @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new homework")
  @Returns(201, HomeworkEVL)
  async createHomework(
    @Req() request: Req,
    @Description("Homework model")
    @BodyParams()
    @Groups("creation")
    data: HomeworkEVL
  ): Promise<HomeworkEVL
  > {

    const user = await this.usersService.find(data.createdBy.toString());
    if (!user) {
      throw new Error(
        `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }


    return this.homeworkEVLservice.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }
  

  
  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update homework with id")
  @Status(201, { description: "Updated HomeworkEVL", type: HomeworkEVLService})
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() HomeworkEVL: HomeworkEVL
  ): Promise<HomeworkEVL| null> {
    return this.homeworkEVLservice.update(id, HomeworkEVL);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a HomeworkEVL")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.homeworkEVLservice.remove(id);
  }
}
