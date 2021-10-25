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
    const zoomclass = await this.zoomclasses.findById(id).populate("section").populate("grade").exec();
    return zoomclass;
  }

  async save(data: ZoomClasses, user: EntityCreationUser): Promise<ZoomClasses> {
    const zoomclass = new this.zoomclasses(data);
    await zoomclass.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "ZoomClasses" });
    return zoomclass;
  }

  async update(id: string, data: ZoomClasses): Promise<ZoomClasses | null> {
    const zoomclass = await this.zoomclasses.findById(id).exec();
    if (zoomclass) {
      zoomclass.section = data.section;
      zoomclass.grade = data.grade;
      zoomclass.classtittle = data.classtittle;
      zoomclass.classdate = data.classdate;
      zoomclass.role = data.role;
      zoomclass.duration = data.duration;
      zoomclass.description = data.description;
      // zoomclass.  options=data.options;
      zoomclass.type = data.type;


      zoomclass.status = data.status;
      await zoomclass.save();
    }
    return zoomclass;
  }

  async query(options = {}): Promise<ZoomClasses[]> {
    options = objectDefined(options);
    return this.zoomclasses.find(options).populate("section").populate("grade").exec();
  }

  async remove(id: string): Promise<ZoomClasses> {
    return await this.zoomclasses.findById(id).remove().exec();
  }
}
