import {
    BodyParams,
    Controller,
    Delete,
    Get,
    PathParams,
    Post,
    Put,
    Req,
    Use
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
  import { Content} from "src/models/download/Content";
  import {ContentService } from "src/services/ContentService";
  import { User } from "src/models/users/User";
  import { UsersService } from "src/services/UsersService";
  import { UploadMiddleware } from "src/middlewares/FileUpload";
  
  @Controller("/Content")
  export class ContentController {
    constructor(private contentService: ContentService,
      private usersService: UsersService
      ) { }
  
    @Get("/")
    @Authorize("jwt")
    @AcceptRoles("admin")
    @Summary("Return all content")
    @Returns(200, Content)
    async getAllContent(@Req() request: Req): Promise<Content[]> {
      let query = {};
      if ((request.user as any).role !== "superadmin") {
        query = { _id: request.permissions.readIds };
      }
      return this.contentService.query(query);
    }
  
    @Get("/:id")
    @Authorize("jwt")
    @AcceptRoles("admin")
    @Summary("Return content based on id")
    @Returns(200, Content)
    async getContent(
      @PathParams("id") id: string,
      @Req() request: Req
    ): Promise<Content | null> {
      if (
        (request.user as any).role !== "superadmin" &&
        !request.permissions.readIds.includes(id)
      ) {
        throw new Error("You don't have sufficient permissions");
      }
      return this.contentService.find(id);
    }
  
    @Post("/")
    @Use(UploadMiddleware)
    @Security("oauth_jwt")
    @Authorize("jwt")
    @AcceptRoles("admin")
    @Summary("Create new Content")
    @Returns(201,Content)
    async createContent(
      @Req() request: Req,
      @Description("Subject model")
      @BodyParams()
      @Groups("creation")
      data: Content
    ): Promise<Content> {
     // console.log(request.file.filename)
      const user = await this.usersService.find(data.createdBy.toString());
      if (!user) {
        throw new Error(
          `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
        );
      }
  
      let dataTemp : any =data;
      //console.log(request.files)
      dataTemp.file= request && request.files && request.files;
      return this.contentService.save(dataTemp, {
        role: (request.user as any).role, 
        _id: (request.user as any)._id,
        adminId: (request.user as any).adminId,
      });
    }
    
  
    
    @Put("/:id")
    @Security("oauth_jwt")
    @Authorize("jwt")
    @AcceptRoles("admin")
    @Summary("Update content with id")
    @Status(201, { description: "Updated subject", type: Content})
    update(
      @PathParams("id") @Required() id: string,
      @BodyParams() @Groups("updation") @Required() content: Content
    ): Promise<Content| null> {
      return this.contentService.update(id, content);
    }
  
    @Delete("/:id")
    @Authorize("jwt")
    @AcceptRoles("admin")
    @Summary("Remove a Content")
    @Status(204, { description: "No content" })
    async remove(@PathParams("id") id: string): Promise<void> {
      await this.contentService.remove(id);
    }
  }
  