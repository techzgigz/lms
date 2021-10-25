import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Homework } from "src/models/homework/Homework";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class HomeworkService {
  @Inject(Homework
    ) private homework: MongooseModel<Homework>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Homework | null> {
    const Homework = await this.homework.findById(id).populate("section").populate("subject").populate("grade").exec();
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
     homework._id = data._id;
      homework.section = data.section;
      homework. grade = data.grade;
      homework.subject = data.subject;
      homework.homeworkdate = data.homeworkdate;
      homework.submissiondate = data.submissiondate;
      homework.zoomclass = data.zoomclass;
      homework.shortdescription = data.shortdescription;
      homework.description = data.description;
      homework.files = data.files;
      homework.type = data.type;
      homework.evaluate = data.evaluate;
      homework.evaluatedate = data.evaluatedate;
      homework.evaluateby = data.evaluateby;
      homework.teacherid = data.teacherid;
      homework.evaluateby = data.evaluateby;
      homework.status = data.status;
      homework.createdBy = data.createdBy;
      await homework.save();
    }
    return homework;
  }

  async query(options = {}): Promise<Homework[]> {
    options = objectDefined(options);
    return this.homework.find(options).populate("section").populate("subject").populate("grade").exec();
  }

  async remove(id: string): Promise<Homework> {
    return await this.homework.findById(id).remove().exec();
  }
}
