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
import { Medium } from "../mediums/Medium";
import { Grade} from "../grades/Grades";
import {Subject} from "../subjects/Subject"
import { User } from "../users/User";


@Model({ schemaOptions: { timestamps: true } })
export class Lesson {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Ref(() => Medium)
  @Required()
  medium: Ref<Medium>;


  @Ref(() => Subject)
  @Required()
  subject: Ref<Subject>;

  
  @Ref(() => Grade)
  @Required()
  grade: Ref<Grade>;
  

  @Property()
  @Trim()
  name: string;

  @Property()
  @Required()
  teacherId: string;

  @Property()
  @Enum("active", "inactive")
  @Default("active")
  status: string;

  @Ref(User)
  @Groups("!updation")
  createdBy: Ref<User>;
}
