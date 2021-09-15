import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Lesson } from "src/models/syllabus/Lesson";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class LessonService {
  @Inject(Lesson) private lesson: MongooseModel<Lesson>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Lesson | null> {
    const Lesson = await this.lesson.findById(id).exec();
    return Lesson;
  }

  async save(data: Lesson, user: EntityCreationUser): Promise<Lesson> {
    const Lesson = new this.lesson(data);
    await Lesson.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Fee" });
    return Lesson;
  }

  async update(id: string, data: Lesson): Promise<Lesson | null> {
    const lessons = await this.lesson.findById(id).exec();
    if (lessons) {
  //  lesson.grade = data.grade;
     lessons.teacherId = data.teacherId;
      lessons.medium = data.medium;
      lessons. name = data.name;
      lessons.status = data.status;
      await lessons.save();
    }
    return lessons;
  }

  async query(options = {}): Promise<Lesson[]> {
    options = objectDefined(options);
    return this.lesson.find(options).populate("medium").populate("subject").populate("grade").exec();
  }

  async remove(id: string): Promise<Lesson> {
    return await this.lesson.findById(id).remove().exec();
  }
}
