import {
  BodyParams,
  Controller,
  Delete,
  Get,
  PathParams,
  Post,
  Put,
} from "@tsed/common";
import { Authorize } from "@tsed/passport";
import { Description, Required, Returns, Status, Summary } from "@tsed/schema";
import { AcceptRoles } from "src/decorators/AcceptRoles";
import { Class } from "src/models/classes/Classes";
import { ClassesService } from "src/services/ClassesService";

@Controller("/classes")
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Get("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return all Classes")
  @Returns(200, Class)
  async getAllClasses(): Promise<Class[]> {
    return this.classesService.query();
  }

  @Get("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Return Class based on id")
  @Returns(200, Class)
  async getClass(@PathParams("id") id: string): Promise<Class | null> {
    return this.classesService.find(id);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new Class")
  @Returns(201, Class)
  async createClass(
    @Description("Class model")
    @BodyParams()
    @Required()
    classObj: Class
  ): Promise<Class> {
    return this.classesService.save(classObj);
  }

  @Post("/")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Update Class with id")
  @Status(201, { description: "Updated Class", type: Class })
  update(
    @PathParams("id") @Required() id: string,
    @BodyParams() @Required() Class: Class
  ): Promise<Class | null> {
    return this.classesService.update(id, Class);
  }

  @Delete("/:id")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Remove a Class")
  @Status(204, { description: "No content" })
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.classesService.remove(id);
  }
}