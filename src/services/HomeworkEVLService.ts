import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { HomeworkEVL } from "src/models/homework/HomeworkEVL";
import { HomeworkUpload } from "src/models/Homework/HomeworkUpload";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class HomeworkEVLService {
  @Inject(HomeworkEVL) private homeworkEVL: MongooseModel<HomeworkEVL>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<HomeworkEVL | null> {
    const HomeworkEVL = await this.homeworkEVL.findById(id).populate("section").populate("grade").exec();
    return HomeworkEVL;
  }

  async save(data: HomeworkEVL, user: EntityCreationUser): Promise<HomeworkEVL> {
    const homeworkEVL = new this.homeworkEVL(data);
    await homeworkEVL.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Fee" });
    return homeworkEVL;
  }

  async update(id: string, data: HomeworkEVL): Promise<HomeworkEVL | null> {
    const homeworkEVL = await this.homeworkEVL.findById(id).exec();
    if (homeworkEVL) {
      //  lesson.grade = data.grade;
      
      homeworkEVL.section = data.section;
      homeworkEVL.grade = data.grade;
      homeworkEVL.classtittle = data.classtittle;
      homeworkEVL.classdate = data.classdate;
      homeworkEVL.role = data.role;
      homeworkEVL.duration = data.duration;
      homeworkEVL.description = data.description;
      homeworkEVL.options = data.options;
      homeworkEVL.type = data.type;
      homeworkEVL.status = data.status;
      homeworkEVL.createdBy = data.createdBy;

      await homeworkEVL.save();
    }
    return homeworkEVL;
  }

  async query(options = {}): Promise<HomeworkEVL[]> {
    options = objectDefined(options);
    return this.homeworkEVL.find(options).populate("section").populate("grade").exec();
  }

  async remove(id: string): Promise<HomeworkEVL> {
    return await this.homeworkEVL.findById(id).remove().exec();
  }
}
