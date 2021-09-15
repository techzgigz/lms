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
    Security
  } from "@tsed/schema";
  import { AcceptRoles } from "src/decorators/AcceptRoles";
  import{ TimeTable } from "src/models/syllabus/TimeTable";
  import {   TimeTableService } from "src/services/TimeTableService";
  import { UsersService } from "src/services/UsersService";
  @Controller("/timeTable")
  export class TimeTableController{
    constructor(private timetableService:  TimeTableService,
      private usersService: UsersService
      ) {}
  
    @Get("/")
    @Authorize("jwt")
    @AcceptRoles("admin")
    @Summary("Return all TimeTable")
    @Returns(200, TimeTable)
    async getAllTimeTable(@Req() request: Req): Promise<TimeTable[]> {
      let query = {};
      if ((request.user as any).role !== "superadmin") {
        query = { _id: request.permissions.readIds };
      }
      return this.timetableService.query(query);
    }
  
    @Get("/:id")
    @Authorize("jwt")
    @AcceptRoles("admin")
    @Summary("Return TimeTable based on id")
    @Returns(200, TimeTable)
    async getTimeTable(
      @PathParams("id") id: string,
      @Req() request: Req
    ): Promise<TimeTable | null> {
      if (
        (request.user as any).role !== "superadmin" &&
        !request.permissions?.readIds.includes(id)
      ) {
        throw new Error("You don't have sufficient permissions");
      }
      return this.timetableService.find(id);
    }
  
    @Post("/")
  @Security("oauth_jwt")
  @Authorize("jwt")
  @AcceptRoles("admin")
  @Summary("Create new TimeTable")
  @Returns(201, TimeTable)
  async createTimeTable(
    @Req() request: Req,
    @Description("TimeTable model")
    @BodyParams()
    @Groups("creation")
    data: TimeTable
  ): Promise<TimeTable> {

    const user = await this.usersService.find(data.createdBy.toString());
    if (!user) {
      throw new Error(
        `User with id: ${data.createdBy} doesn't exist or is superadmin, use other role.`
      );
    }
    return this.timetableService.save(data, {
      role: (request.user as any).role,
      _id: (request.user as any)._id,
      adminId: (request.user as any).adminId,
    });
  }
  
    @Put("/:id")
    @Authorize("jwt")
    @AcceptRoles("admin")
    @Summary("Update TimeTable with id")
    @Status(201, { description: "Updated TimeTable", type: TimeTable })
    update(
      @PathParams("id") @Required() id: string,
      @BodyParams() @Required() @Groups('updation') time: TimeTable
    ): Promise<TimeTable| null> {
      return this.timetableService.update(id, time);
    }
  
    @Delete("/:id")
    @Authorize("jwt")
    @AcceptRoles("admin")
    @Summary("Remove a TimeTable")
    @Status(204, { description: "No content" })
    async remove(@PathParams("id") id: string): Promise<void> {
      await this.timetableService.remove(id);
    }
  }
  