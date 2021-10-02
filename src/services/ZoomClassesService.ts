import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { ZoomClasses } from "src/models/ZoomClasses/ZoomClasses";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class ZoomClassesService {
  @Inject(ZoomClasses) private zoomclasses: MongooseModel<ZoomClasses>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<ZoomClasses | null> {
    const zoomclass = await this.zoomclasses.findById(id).populate("medium").populate("subject").populate("grade").exec();
    return zoomclass;
  }

  async save(data: ZoomClasses, user: EntityCreationUser): Promise<ZoomClasses> {
    const zoomclass = new this.zoomclasses(data);
    await ZoomClasses.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "Fee" });
    return ZoomClasses;
  }

  async update(id: string, data: ZoomClasses): Promise<ZoomClasses | null> {
    const zoomclass = await this.zoomclasses.findById(id).exec();
    if (zoomclass) {
  //  lesson.grade = data.grade;
     zoomclasses.teacherId = data.teacherId;
      zoomclasses.medium = data.medium;
      zoomclasses. name = data.name;
      zoomclasses.status = data.status;
      await zoomclass.save();
    }
    return ZoomClasses;
  }

  async query(options = {}): Promise<ZoomClasses[]> {
    options = objectDefined(options);
    return this.zoomclasses.find(options).populate("medium").populate("subject").populate("grade").exec();
  }

  async remove(id: string): Promise<ZoomClasses> {
    return await this.zoomclasses.findById(id).remove().exec();
  }
}
