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
import { ZoomClasses } from "./ZoomClasses";


@Model({ schemaOptions: { timestamps: true } })
export class ZoomClassesReport {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Ref(() => ZoomClasses)
  @Required()
  zoomclass: Ref<ZoomClasses>;

  @Property()
  @Required()
  host: String;
  

  @Property()
  @Trim()
  host: string;

  @Property()
  @Required()
  member:[] ;

  @Format("date")
  @Required()
  starttime: Date;

  @Format("date")
  @Required()
  closetime: Date;

  @Property()
  @Required()
  totalmemeber: number;

  @Property()
  @Required()
  currentmember: number;

  @Ref(User)
  @Groups("!updation")
  createdBy: Ref<User>;
}
