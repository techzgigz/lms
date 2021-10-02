import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Homework } from "src/models/syllabus/Homework";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class HomeworkClassesService {
  @Inject(Homework
    ) private Homework: MongooseModel<Homework>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Homework | null> {
    const Homework = await this.homework.findById(id).populate("medium").populate("subject").populate("grade").exec();
    return Homework;
  }

  async save(data: Homework, user: EntityCreationUser): Promise<Homework> {
    const Homework = new this.homework(data);
    await Homework.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Fee" });
    return Homework;
  }

  async update(id: string, data: Homework): Promise<Homework | null> {
    const homework = await this.homework.findById(id).exec();
    if (homework) {
  //  lesson.grade = data.grade;
     homework.teacherId = data.teacherId;
      homework.medium = data.medium;
      homework. name = data.name;
      homework.status = data.status;
      await homework.save();
    }
    return homework;
  }

  async query(options = {}): Promise<Homework[]> {
    options = objectDefined(options);
    return this.homework.find(options).populate("medium").populate("subject").populate("grade").exec();
  }

  async remove(id: string): Promise<Homework> {
    return await this.homework.findById(id).remove().exec();
  }
}
