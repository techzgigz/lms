import { Model, ObjectID, Ref, Trim } from "@tsed/mongoose";
import {
  Default,
  Enum,
  Groups,
  MaxLength,
  MinLength,
  Property,
  Required,
  Minimum,
  Maximum,
  Format,

} from "@tsed/schema";
import{Lesson } from "src/models/syllabus/Lesson";
import { User } from "../users/User";

@Model({ schemaOptions: { timestamps: true } })
export class Topic {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Ref(Lesson)
  @Required()
  lesson: Ref<Lesson>;

  @Property()
  @Trim()
  name: string;

  @Property()
  @Required()
  @Minimum(0)
  @Maximum(100)
  @Trim()
  progress: Number;

  @Format("date-time")
  @Default(Date.now)
  date: Date = new Date();
  
  @Property()
  @Default(false)
  completed: boolean;
  
  @Property()
  @Required()
  teacherId: string;


  @Property()
  @Required()
  note: string; 

  @Property()
  @Required()
  studyMaterial: []; 

  @Property()
  @Required()
  remark: string; 

  @Property()
  @Enum("active", "inactive")
  @Default("active")
  status: string;

  @Ref(User)
  @Groups("!updation")
  createdBy: Ref<User>;


}
