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

@Model({ schemaOptions: { timestamps: true } })
export class House {
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
  @MinLength(3)
  @MaxLength(50)
  @Trim()
  description: string;

  @Property()
  @Enum("active", "inactive")
  @Default("active")
  status: string;
}