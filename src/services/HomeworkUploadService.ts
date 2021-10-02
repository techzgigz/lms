import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { HomeworkUpload } from "src/models/Homework/HomeworkUpload";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class homeworkuploadservice {
  @Inject(HomeworkUpload) private homeworkupload: MongooseModel<HomeworkUpload>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<HomeworkUpload | null> {
    const homeworkupload = await this.homeworkupload.findById(id).populate("medium").populate("subject").populate("grade").exec();
    return homeworkupload;
  }

  async save(data: HomeworkUpload, user: EntityCreationUser): Promise<HomeworkUpload> {
    const homeworkupload = new this.homeworkupload(data);
    await HomeworkUpload.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Fee" });
    return homeworkupload;
  }

  async update(id: string, data: HomeworkUpload): Promise<HomeworkUpload | null> {
    const homeworkupload = await this.homeworkupload.findById(id).exec();
    if (homeworkupload) {
  //  lesson.grade = data.grade;
     homeworkupload.teacherId = data.teacherId;
      homeworkupload.medium = data.medium;
      homeworkupload. name = data.name;
      homeworkupload.status = data.status;
      await homeworkupload.save();
    }
    return homeworkupload;
  }

  async query(options = {}): Promise<HomeworkUpload[]> {
    options = objectDefined(options);
    return this.homeworkupload.find(options).populate("medium").populate("subject").populate("grade").exec();
  }

  async remove(id: string): Promise<HomeworkUpload> {
    return await this.homeworkupload.findById(id).remove().exec();
  }
}
