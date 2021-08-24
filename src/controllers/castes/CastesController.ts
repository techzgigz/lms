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
} from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { Caste } from "src/models/castes/Caste";
import { CastesService } from "src/services/CastesService";

@Controller("/castes")
export class CastesController {
  constructor(private castesService: CastesService) {}

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Castes")
  @Returns(200, Caste)
  async getAllCastes(@Req() request: Req): Promise<Caste[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.castesService.query(query);
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Caste based on id")
  @Returns(200, Caste)
  async getCaste(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Caste | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.castesService.find(id);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Caste")
  @Returns(201, Caste)
  async createCaste(
    @Req() request: Req,
    @Description("Caste model")
    @BodyParams()
    @Groups("creation")
    data: Caste
  ): Promise<Caste> {
    if (request.user) {
      data = { ...data, createdBy: (request.user as any)._id };
    }
    return this.castesService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }

  @Put("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Caste with id")
  @Status(201, { description: "Updated Caste", type: Caste })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() @Groups('updation') Caste: Caste
  ): Promise<Caste | null> {
    return this.castesService.update(id, Caste);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Caste")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.castesService.remove(id);
  }
}
