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
import * as jwt from "jsonwebtoken";// import * as multer from 'multer'
import requestPost from 'request-promise';

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
      !request.permissions.readIds.includes(id)
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
    const YOUR_CLIENT_SECRET: any = process.env.YOUR_CLIENT_SECRET;
    const now = Date.now();
    const JWT = await jwt.sign(
      {
        iss: process.env.YOUR_CLIENT_ID,
        exp: now + 3600 * 1000
      },
      YOUR_CLIENT_SECRET
    );

    var options = {
      method: 'POST',
      uri: 'https://api.zoom.us/v2/users/36t77U09T7GWMGpZAwh4JQ/meetings',
      body: {
        //status: 'active',
        host_id: data.createdBy, topic: data.classtittle, type: data.type, "start_time": data.classdate,
        "duration": data.duration,
        //"schedule_for": data.createdBy,// -> uri + '?status=active'
      },
      auth: {
        //Provide your token here
        'bearer': JWT//'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJORnV1Nklrc1RjeUpxWElrMzR5YkFnIiwiZXhwIjoxNjMzNTIwNTUwNTg0LCJpYXQiOjE2MzM1MTY5NTB9.idgcj8DM82-gi8d1ZOpyW-J-KzL5Hf0UnpeNFq1LyAA'
      },
      json: true,
      headers: {
        'User-Agent': 'Zoom-Jwt-Request',
        'content-type': 'application/json',

      }// Automatically parses the JSON string in the response
    };
    let _this = this;
    //
    //try {
    return await requestPost(options).then(async function (meeting: any) {
      data.options = JSON.stringify(meeting);
      return await _this.zoomClassesService.save(data, {
        role: (request.user as any).role,
        _id: (request.user as any)._id,
        adminId: (request.user as any).adminId,
      });

    })
      .catch(function (err: any) {
        // API call failed...
        console.log('API call failed, reason ', err);
        throw new Error(
          `API call failed, reason `
        );
      });
    // .catch (err) {
    //    
  }



  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update zoomclasses with id")
  @Status(201, { description: "Updated zoomclasses", type: ZoomClasses })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() ZoomClasses: ZoomClasses
  ): Promise<ZoomClasses | null> {
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
