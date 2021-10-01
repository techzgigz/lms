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
  Security,
  Status,
  Summary,
} from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { Department } from "src/models/departments/Department";
import { DepartmentsService } from "src/services/DepartmentsService";
import { UsersService } from "src/services/UsersService";

@Controller("/departments")
export class DepartmentsController {
  constructor(
    private departmentsService: DepartmentsService,
    private usersService: UsersService
  ) {}

  @Get("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Departments")
  @Returns(200, Department)
  async getAllDepartments(@Req() request: Req): Promise<Department[]> {
    let query = {};
    if ((request.user as any).role !== "superadmin") {
      query = { _id: request.permissions?.readIds };
    }
    return this.departmentsService.query(query);
  }

  @Get("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Department based on id")
  @Returns(200, Department)
  async getDepartment(
    @PathParams("id") id: string,
    @Req() request: Req
  ): Promise<Department | null> {
    if (
      (request.user as any).role !== "superadmin" &&
      !request.permissions?.readIds?.includes(id)
    ) {
      throw new Error("You don't have sufficient permissions");
    }
    return this.departmentsService.find(id);
  }

  @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Department")
  @Returns(201, Department)
  async createDepartment(
    @Req() request: Req,
    @Description("Department model")
    @BodyParams()
    @Groups("creation")
    data: Department
  ): Promise<Department> {
    const user = await this.usersService.find(data.createdBy.toString());
    if (!user || user.role === "superadmin") {
      throw new Error(
        `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }
    return this.departmentsService.save(data, {
      role: user.role,
      _id: user._id,
      adminId: user.adminId,
    });
  }

  @Put("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Department with id")
  @Status(201, { description: "Updated Department", type: Department })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Groups("updation") @Required() Department: Department
  ): Promise<Department | null> {
    return this.departmentsService.update(id, Department);
  }

  @Delete("/:id")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Department")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.departmentsService.remove(id);
  }
}
