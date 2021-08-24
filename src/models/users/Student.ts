import { Model, Ref } from "@tsed/mongoose";
import { Default, Min, Optional, Property, Required } from "@tsed/schema";
import { Grade } from "../grades/Grades";
import { User } from "./User";

@Model({ schemaOptions: { timestamps: true } })
export class Student {
  @Ref(User)
  @Required()
  user: Ref<User>;

  @Property()
  @Min(0)
  @Default(0)
  rollNumber: number;

  @Ref(Grade)
  @Optional()
  grade: Ref<Grade>;
}
