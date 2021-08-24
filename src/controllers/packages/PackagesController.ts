import {
  $log,
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
} from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { Package } from "src/models/packages/Package";
import { PackagesService } from "src/services/PackagesService";

@Controller("/packages")
export class PackagesController {
  constructor(private packagesService: PackagesService) {}

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Packages")
  @Returns(200, Package)
  async getAllCastes(@Req() request: Req): Promise<Package[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.packagesService.query(query);
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Package based on id")
  @Returns(200, Package)
  async getCaste(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Package | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.packagesService.find(id);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Package")
  @Returns(201, Package)
  async createPackage(
    @Req() request: Req,
    @Description("Package model")
    @BodyParams()
    @Groups("creation")
    data: Package
  ): Promise<Package> {
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.packagesService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }

  @Put("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Package with id")
  @Status(201, { description: "Updated Package", type: Package })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() @Groups('updation') Package: Package
  ): Promise<Package | null> {
    return this.packagesService.update(id, Package);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Package")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.packagesService.remove(id);
  }
}
