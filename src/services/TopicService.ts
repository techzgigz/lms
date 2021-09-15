import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { Topic } from "src/models/syllabus/Topic";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class TopicService {
  @Inject(Topic) private Topic: MongooseModel<Topic>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<Topic | null> {
    const topic = await this.Topic.findById(id).exec();
    return topic;
  }

  async save(data: Topic, user: EntityCreationUser): Promise<Topic> {
    const topic = new this.Topic(data);
    await topic.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Fee" });
    return topic;
  }

  async update(id: string, data: Topic): Promise<Topic | null> {
    const topic = await this.Topic.findById(id).exec();
    if (topic) {
      topic.name = data.name;
      topic.progress = data.progress;
      topic.date = data.date;
      topic.completed = data.completed;
      topic.status = data.status;
      topic. teacherId = data. teacherId;
      topic. note = data. note;
      await topic.save();
    }
    return topic;
  }

  async query(options = {}): Promise<Topic[]> {
    options = objectDefined(options);
  
    return this.Topic.find(options).populate("lesson").populate("school").exec();
  }

  async remove(id: string): Promise<Topic> {
    return await this.Topic.findById(id).remove().exec();
  }
}
