import { Model, ObjectID, Ref, Trim, } from "@tsed/mongoose";
import { Default, Enum, Groups, Property, Required, Format, } from "@tsed/schema";
import { Topic } from "src/models/syllabus/Topic";
import { User } from "../users/User";


@Model({ schemaOptions: { timestamps: true } })
export class LessonPlan {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;


  @Ref(() => Topic)
  @Required()
  topic: Ref<Topic>;


  @Property()
  @Required()
  subTopic: string;

  @Required()
  @Format("date")
  startedAt: Date;



  // @Format("Time")
  // @Required()
  // startTime: "time";

  @Format("date")
  @Required()
  startTime: Date;

  @Format("date")
  @Required()
  endtTime: Date;

  // @Property()
  // @Required()
  // @Trim()
  // startTime: TimeRanges;

  // @Format("Time")
  // @Required()
  // endtTime: "time";

  @Property()
  @Required()
  youTubeUrl: string;


  @Property()
  @Required()
  Video: string;

  @Property()
  @Required()
  document: [];

  @Property()
  @Required()
  teachingMethod: string;

  @Property()
  @Required()
  generalObjective: string;

  @Property()
  @Required()
  previousKnowledge: string;

  @Property()
  @Required()
  @Trim()
  question: string;

  @Property()
  @Required()
  presentation:[];

  @Property()
  @Required()
  teacherId: string;


  @Property()
  @Required()
  sedhuleId: string ;

  @Property()
  @Enum("active", "inactive")
  @Default("active")
  status: string;

  @Ref(User)
  @Groups("!updation")
  createdBy: Ref<User>;
}
