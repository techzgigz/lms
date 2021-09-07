import { Model, ObjectID, Ref, Trim, Unique } from "@tsed/mongoose";
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
export class Medium {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Unique()
  @Required()
  @MinLength(3)
  @MaxLength(50)
  @Trim()
  name: string;

  @Property()
  @Enum("active", "inactive")
  @Default("active")
  status: string;

  @Ref(User)
  @Groups("!updation")
  createdBy: Ref<User>;
}
