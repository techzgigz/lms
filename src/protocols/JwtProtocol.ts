import { Inject, Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { Arg, OnVerify, Protocol } from "@tsed/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../services/UsersService";
// import { deserialize } from "json-schema";
// import { User } from "src/models/users/User";

@Protocol({
  name: "jwt",
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.APP_SECRET || "supersecret",
    issuer: "localhost",
    audience: "localhost",
  },
})
export class JwtProtocol implements OnVerify {
  @Inject() usersService: UsersService;

  async $onVerify(@Req() req: Req, @Arg(0) jwtPayload: any) {
    const user = await this.usersService.findOne({
      _id: jwtPayload.sub,
    });
    if (!user) {
      throw new Unauthorized("Wrong token");
    }
    // const result = deserialize({ ...user }, { type: User, groups: ["update"] });
    // console.log(result);
    req.user = user;
    // req.permissions = {
    //   readIds: [],
    //   updateIds: [],
    //   deleteIds: [],
    // };

    return user;
  }
}
