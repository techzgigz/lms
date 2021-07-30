import { $log, BodyParams, Controller, Get, Post } from "@tsed/common";
import { Authorize } from "@tsed/passport";
import {
  Description,
  Required,
  Returns,
  Status,
  Summary,
  Groups,
} from "@tsed/schema";
import { User } from "src/models/users/User";
import { UsersService } from "src/services/UsersService";

@Controller("/users")
export class UserController {
  constructor(private usersService: UsersService) {}

  @Get("/")
  @Summary("Return all users")
  @(Returns(200, User).Groups("group.*"))
  async getAllUsers(): Promise<User[]> {
    return this.usersService.query();
  }

  @Post("/")
  @Summary("Create new user")
  @(Returns(201, User).Groups("group.*"))
  async createUser(
    @Description("User model") @BodyParams() @Required() userObj: User
  ): Promise<User> {
    $log.info(userObj);
    return this.usersService.save(userObj);
  }
}
