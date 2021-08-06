import { Model, ObjectID, Trim } from "@tsed/mongoose";
import {
  Default,
  Enum,
  Groups,
  MaxLength,
  MinLength,
  Property,
  Required,
} from "@tsed/schema";
import { User } from "../users/User";

@Model({ schemaOptions: { timestamps: true } })
export class Caste {
  @Groups("!creation")
  @ObjectID("id")
  _id: string;

  @Property()
  @Required()
  @MinLength(3)
  @MaxLength(50)
  @Trim()
  name: string;

  @Property()
  @Enum("active", "inactive")
  @Default("active")
  status: string;

  @ObjectID()
  @Required()
  createdBy: User;
}
