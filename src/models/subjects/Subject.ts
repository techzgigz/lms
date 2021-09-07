import { Model, ObjectID, Ref, Trim } from "@tsed/mongoose";
import {
  Default,
  Enum,
  Groups,
  MaxLength,
  MinLength,
  Property,
  Required,
} from "@tsed/schema";
import { Grade } from "../grades/Grades";
import { User } from "../users/User";

@Model({ schemaOptions: { timestamps: true } })
export class Subject {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Required()
  @MinLength(3)
  @MaxLength(50)
  @Trim()
  name: string;

  @Required()
  @MinLength(3)
  @MaxLength(20)
  @Trim()
  code: string;

  @Required()
  @Enum("theoretical", "practical")
  type: string;

  @Ref(() => Grade)
  @Required()
  grade: Ref<Grade>;

  // @Required()
  // format: string;

  @Property()
  @Enum("active", "inactive")
  @Default("active")
  status: string;

  @Ref(User)
  @Groups("!creation", "!updation")
  createdBy?: Ref<User>;
}
