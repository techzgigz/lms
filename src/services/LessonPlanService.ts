import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { LessonPlan } from "src/models/syllabus/lessonPlan";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class LessonPlanService {
  @Inject(LessonPlan) private LessonPlan: MongooseModel<LessonPlan>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<LessonPlan | null> {
    const LessonPlan = await this.LessonPlan.findById(id).exec();
    return LessonPlan;
  }

  async save(data: LessonPlan, user: EntityCreationUser): Promise<LessonPlan> {
    const lessonPlan = new this.LessonPlan(data);
    await lessonPlan.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Fee" });
    return lessonPlan;
  }

  async update(id: string, data: LessonPlan): Promise<LessonPlan | null> {
    const lessonplan = await this.LessonPlan.findById(id).exec();
    if (lessonplan) {
      lessonplan.subTopic = data.subTopic;
      lessonplan.topic = data.topic;
      lessonplan.startedAt = data.startedAt;
      lessonplan.startTime = data.startTime;
      lessonplan.status = data.status;
      lessonplan.youTubeUrl = data.youTubeUrl;
      lessonplan.document = data.document;
      lessonplan.teachingMethod = data.teachingMethod;
      lessonplan.generalObjective = data.generalObjective;
      lessonplan.previousKnowledge = data.previousKnowledge;
      lessonplan.question = data.question;
      lessonplan.presentation = data.presentation;
      lessonplan.sedhuleId = data.sedhuleId;
      await lessonplan.save();
    }
    return lessonplan;
  }

  async query(options = {}): Promise<LessonPlan[]> {
    options = objectDefined(options);
    return this.LessonPlan.find(options).populate("topic").exec();
  }

  async remove(id: string): Promise<LessonPlan> {
    return await this.LessonPlan.findById(id).remove().exec();
  }
}
