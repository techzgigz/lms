import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { TimeTable } from "src/models/syllabus/TimeTable";
import { Topic } from "src/models/syllabus/Topic";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class TimeTableService {
  @Inject(TimeTable) private timetable: MongooseModel<TimeTable>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<TimeTable | null> {
    const topic = await this.timetable.findById(id).exec();
    return topic;
  }

  async save(data: TimeTable, user: EntityCreationUser): Promise<TimeTable> {
    const topic = new this.timetable(data);
    await topic.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Fee" });
    return topic;
  }

  async update(id: string, data: TimeTable): Promise<TimeTable | null> {
    const TimeTable = await this.timetable.findById(id).exec();
    if (TimeTable) {
      TimeTable.day = data.day;
      TimeTable.classId = data.classId;
      // TimeTable.medium = data.medium;
      TimeTable.subjectId = data.subjectId;
      TimeTable.teacherId = data.teacherId;
      TimeTable.roomNumber = data.roomNumber;
      TimeTable.mode = data.mode;
      TimeTable.position = data.position;

      await TimeTable.save();
    }
    return TimeTable;
  }

  async query(options = {}): Promise<TimeTable[]> {
    options = objectDefined(options);
    return this.timetable.find(options).populate("lesson").exec();

  }
  async remove(id: string): Promise<TimeTable> {
    return await this.timetable.findById(id).remove().exec();
  }
}
