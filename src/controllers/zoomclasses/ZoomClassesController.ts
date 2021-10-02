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
import { ZoomClasses } from "src/models/zoomclasses/ZoomClasses";//
import { ZoomClassesService } from "src/services/ZoomClassesService";//
import { User } from "src/models/users/User";
import { UsersService } from "src/services/UsersService";
import * as multer from 'multer'

@Controller("/zoomClasses")//
export class ZoomClassesController {
  constructor(private zoomClassesService: ZoomClassesService,//
    private usersService: UsersService
    ) { }

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all ZoomClasses")
  @Returns(200, ZoomClasses)
  async getAllZoomClasses(@Req() request: Req): Promise<ZoomClasses[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions.readIds };
    }
    return this.zoomClassesService.query(query);
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return ZoomClassses based on id")
  @Returns(200, ZoomClasses)
  async getZoomClasses(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<ZoomClasses | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.zoomClassesService.find(id);
  }

  @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new zoomclasses")
  @Returns(201, ZoomClasses)
  async createZoomClasses(
    @Req() request: Req,
    @Description("ZoomClasses model")
    @BodyParams()
    @Groups("creation")
    data: ZoomClasses
  ): Promise<ZoomClasses> {

    const user = await this.usersService.find(data.createdBy.toString());
    if (!user) {
      throw new Error(
        `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }


    return this.zoomClassesService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }
  

  
  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update zoomclasses with id")
  @Status(201, { description: "Updated zoomclasses", type: ZoomClasses})
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() ZoomClasses: ZoomClasses
  ): Promise<ZoomClasses| null> {
    return this.zoomClassesService.update(id, ZoomClasses);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a ZoomClasses")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.zoomClassesService.remove(id);
  }
}
