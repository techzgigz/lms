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
import { ZoomClassesReport } from "src/models/Zoomclasses/ZoomClassesReport";//
import { ZoomClassesReportService } from "src/services/ZoomClassesReportsService";//
import { User } from "src/models/users/User";
import { UsersService } from "src/services/UsersService";


@Controller("/ZoomClassesReport")//
export class ZoomClassesReportsController {
  constructor(private ZoomClassesReportsService: ZoomClassesReportService,//
    private usersService: UsersService
  ) { }

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Zoomclassesreports")
  @Returns(200, ZoomClassesReport)
  async getAllZoomClassesReport(@Req() request: Req): Promise<ZoomClassesReport[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions.readIds };
    }
    return this.ZoomClassesReportsService.query(query);
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Zoomclassesreports based on id")
  @Returns(200, ZoomClassesReport)
  async getZoomClassesReports(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<ZoomClassesReport | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions.readIds.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.ZoomClassesReportsService.find(id);
  }

  @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new ZoomClassesReports")
  @Returns(201, ZoomClassesReport)
  async createZoomClassesReport(
    @Req() request: Req,
    @Description("ZoomClassesReport model")
    @BodyParams()
    @Groups("creation")
    data: ZoomClassesReport
  ): Promise<ZoomClassesReport> {

    const user = await this.usersService.find(data.createdBy.toString());
    if (user) {
      throw new Error(
        `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }
    return this.ZoomClassesReportsService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }
  @Status(201, { description: "Updated ZoomClassesReports", type: ZoomClassesReport })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() ZoomClassesReports: ZoomClassesReport
  ): Promise<ZoomClassesReport | null> {
    return this.ZoomClassesReportService.update(id, ZoomClassesReports);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a ZoomClassesReports")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.ZoomClassesReportsService.remove(id);
  }
}
