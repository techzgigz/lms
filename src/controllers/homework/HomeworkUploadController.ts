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
  import { HomeworkUpload } from "src/models/homework/HomeworkUpload";//
  import { Homeworkuploadservice } from "src/services/Homeworkuploadservice";//
  import { User } from "src/models/users/User";
  import { UsersService } from "src/services/UsersService";
  
  @Controller("/homeworkupload")//
  export class HomeworkUploadController {
    constructor(private homeworkuploadservice: HomeworkClassesService,//
      private usersService: UsersService
      ) { }
  
    @Get("/")
    @Authorize("jwt")
    @AcceptRoles("admin")
    @Summary("Return all HomeworkUpload")
    @Returns(200, HomeworkUpload)
    async getAllHomeworkUpload(@Req() request: Req): Promise<HomeworkUpload[]> {
      let query = {};
      if ((request.user as any).role !== "superadmin") {
        query = { _id: request.permissions.readIds };
      }
      return this.homeworkuploadservice.query(query);
    }
  
    @Get("/:id")
    @Authorize("jwt")
    @AcceptRoles("admin")
    @Summary("Return HomeworkUpload based on id")
    @Returns(200, HomeworkUpload)
    async getHomeworkUpload(
      @PathParams("id") id: string,
      @Req() request: Req
    ): Promise<HomeworkUpload | null> {
      if (
        (request.user as any).role !== "superadmin" &&
        !request.permissions.readIds.includes(id)
      ) {
        throw new Error("You don't have sufficient permissions");
      }
      return this.homeworkuploadservice.find(id);
    }
  
    @Post("/")
    @Security("oauth_jwt")
    @Authorize("jwt")
    @AcceptRoles("admin")
    @Summary("Create new homeworkupload")
    @Returns(201, HomeworkUpload)
    async createHomeworkUpload(
      @Req() request: Req,
      @Description("HomeworkUpload model")
      @BodyParams()
      @Groups("creation")
      data: HomeworkUpload
    ): Promise<HomeworkUpload> {
  
      const user = await this.usersService.find(data.createdBy.toString());
      if (!user) {
        throw new Error(
          `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
        );
      }
  
  
      return this.homeworkuploadservice.save(data, {
        role: (request.user as any).role,
        _id: (request.user as any)._id,
        adminId: (request.user as any).adminId,
      });
    }
    
  
    
    @Put("/:id")
    @Security("oauth_jwt")
    @Authorize("jwt")
    @AcceptRoles("admin")
    @Summary("Update homeworkupload with id")
    @Status(201, { description: "Updated homeworkupload", type: homeworkuploadservice})
    update(
      @PathParams("id") @Required() id: string,
      @BodyParams() @Groups("updation") @Required() HomeworkUpload: HomeworkUpload
    ): Promise<HomeworkUpload| null> {
      return this.homeworkuploadservice.update(id, HomeworkUpload);
    }
  
    @Delete("/:id")
    @Authorize("jwt")
    @AcceptRoles("admin")
    @Summary("Remove a HomeworkUpload")
    @Status(204, { description: "No content" })
    async remove(@PathParams("id") id: string): Promise<void> {
      await this.homeworkuploadservice.remove(id);
    }
  }
  