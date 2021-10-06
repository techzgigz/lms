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
export class ZoomClasses {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Ref(() => Section)
  @Required()
  section: [Ref<Section>];

  
  @Ref(() => Grade)
  @Required()
  grade: [Ref<Grade>];
  

  @Property()
  @Trim()
  classtittle: string;

  @Format("date")
  @Required()
  classdate: Date;

  @Property()
  @Required()
  role: string;

  @Property()
  @Required()
  duration: number;

  @Property()
  @Required()
  description: string;

  @Property()
  @Required()
  options: string;

  @Property()
  @Required()
  type: number;


  @Property()
  @Enum("pending", "cancelled","completed")
  @Default("pending")
  status: string;

  @Ref(User)
  @Groups("!updation")
  createdBy: Ref<User>;
}
