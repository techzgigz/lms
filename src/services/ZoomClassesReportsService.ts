import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { ZoomClassesReports } from "src/models/ZoomClasses/ZoomClassesReports";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class ZoomClassesReportsService {
  @Inject(ZoomClassesReports) private zoomClassesReports: MongooseModel<ZoomClassesReports>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<ZoomClassesReports | null> {
    const zoomclass = await this.zoomClassesReports.findById(id).populate("section").populate("grade").exec();
    return ZoomClassesReports;
  }

  async save(data: ZoomClassesReports, user: EntityCreationUser): Promise<ZoomClassesReports> {
    const zoomClassesReports = new this.zoomClassesReports(data);
    await zoomClassesReports.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "ZoomClasses" });
    return zoomClassesReports;
  }

  async update(id: string, data: ZoomClassesReports): Promise<ZoomClassesReports | null> {
    const zoomClassesReports = await this.zoomClassesReports.findById(id).exec();
    if (zoomClassesReports) {
      //  lesson.grade = data.grade;
      ZoomClassesReports.section = data.section;
      ZoomClassesReports.grade = data.grade;
      ZoomClassesReports.classtittle = data.classtittle;
      ZoomClassesReports.classdate = data.classdate;
      ZoomClassesReports.role = data.role;
      ZoomClassesReports.duration = data.duration;
      ZoomClassesReports.description = data.description;
      // zoomclass.  options=data.options;
      ZoomClassesReports.type = data.type;


      ZoomClassesReports.status = data.status;
      await ZoomClassesReports.save();
    }
    return ZoomClassesReports;
  }

  async query(options = {}): Promise<ZoomClassesReports[]> {
