import { Model, ObjectID, Ref, Trim } from "@tsed/mongoose";
import {
  Default,
  Enum,
  Format,
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
import { Section } from "../sections/Section";


@Model({ schemaOptions: { timestamps: true } })
export class HomeworkUpload {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Ref(() => HomeworkUpload)
  @Required()
  homework: [Ref<HomeworkUpload>];
  

  @Property()
  @Trim()
  studentid: string;

  @Format("date")
  @Required()
  answer: string;

  @Format("date")
  @Required()
  submissiondate: Date;

  

  @Property()
  @Required()
  files: [];

  @Property()
  @Required()
  evaluate: Boolean;

  @Format("date")
  @Required()
 evaluatedate: Date;

 @Property()
  @Required()
  evaluateby: string;

//   @Property()
//   @Required()
//   teacherid: string;

  @Property()
  @Enum("pending", "cancelled","completed")
  @Default("pending")
  status: string;

  
  @Ref(User)
  @Groups("!updation")
  createdBy: Ref<User>;
}
