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
import { ZoomClasses } from "../zoomclasses/ZoomClasses";


@Model({ schemaOptions: { timestamps: true } })
export class Homework {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Ref(() => Section)
  @Required()
  section: [Ref<Section>];

  
  @Ref(() => Grade)
  @Required()
  grade: [Ref<Grade>];
  

  @Ref(() => Subject)
  @Required()
  subject: Ref<Subject>;

  @Format("date")
  @Trim()
  homeworkdate: Date;

  @Format("date")
  @Required()
  submissiondate: Date;

  @Ref(() => ZoomClasses)
  @Required()
  zoomclass: [Ref<ZoomClasses>];
  

  @Property()
  @Required()
  shortdescription: string;

  @Property()
  @Required()
  description: string;

  @Property()
  @Required()
  files: [];

  @Property()
  @Required()
  type: string;

  @Property()
  @Required()
  evaluate: Boolean;

  @Format("date")
  @Required()
 evaluatedate: Date;

 @Property()
  @Required()
  evaluateby: string;

  @Property()
  @Required()
  teacherid: string;

  @Property()
  @Enum("pending", "cancelled","completed")
  @Default("pending")
  status: string;


  @Ref(User)
  @Groups("!updation")
  createdBy: Ref<User>;
}
