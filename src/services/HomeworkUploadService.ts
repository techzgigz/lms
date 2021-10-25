import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { HomeworkUpload } from "src/models/Homework/HomeworkUpload";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class HomeworkUploadService {
  @Inject(HomeworkUpload) private homeworkupload: MongooseModel<HomeworkUpload>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<HomeworkUpload | null> {
    const homeworkupload = await this.homeworkupload.findById(id).populate("homework").exec();
    return homeworkupload;
  }

  async save(data: HomeworkUpload, user: EntityCreationUser): Promise<HomeworkUpload> {
    const homeworkupload = new this.homeworkupload(data);
    await homeworkupload.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "HomeworkUpload" });
    return homeworkupload;
  }
  
  async update(id: string, data: HomeworkUpload): Promise<HomeworkUpload | null> {
    const homeworkupload = await this.homeworkupload.findById(id).exec();
    if (homeworkupload) {
  //  lesson.grade = data.grade;
     homeworkupload.studentid = data.studentid;
      homeworkupload.answer = data.answer;
      homeworkupload. submissiondate = data.submissiondate;
      homeworkupload.files = data.files;
      homeworkupload. evaluate = data.evaluate;
     homeworkupload. evaluatedate = data.evaluatedate;
     homeworkupload. evaluateby = data.evaluateby;
     homeworkupload. status = data.status;
     homeworkupload. createdBy = data.createdBy;

      await homeworkupload.save();
    }
    return homeworkupload;
  }

  async query(options = {}): Promise<HomeworkUpload[]> {
    options = objectDefined(options);
    return this.homeworkupload.find(options).populate("homework").exec();
  }

  async remove(id: string): Promise<HomeworkUpload> {
    return await this.homeworkupload.findById(id).remove().exec();
  }
}
