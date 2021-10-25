import { Service, Inject } from "@tsed/common";
import { EventEmitterService } from "@tsed/event-emitter";
import { MongooseModel } from "@tsed/mongoose";
import { ZoomClassesReport } from "src/models/ZoomClasses/ZoomClassesReport";
import { objectDefined } from "src/utils";
import { EntityCreationUser } from "./PermissionsService";

@Service()
export class ZoomClassesReportService {
  @Inject(ZoomClassesReport) private zoomClassesReports: MongooseModel<ZoomClassesReport>;
  @Inject() private eventEmitter: EventEmitterService;

  async find(id: string): Promise<ZoomClassesReport | null> {
    const zoomclass = await this.zoomClassesReports.findById(id).populate("section").populate("grade").exec();
    return ZoomClassesReport;
  }

  async save(data: ZoomClassesReport, user: EntityCreationUser): Promise<ZoomClassesReport> {
    const zoomClassesReports = new this.zoomClassesReports(data);
    await zoomClassesReports.save();
    this.eventEmitter.emit("entity.created", { user, moduleName: "ZoomClasses" });
    return zoomClassesReports;
  }

  async update(id: string, data: ZoomClassesReport): Promise<ZoomClassesReport | null> {
    const zoomClassesReports = await this.zoomClassesReports.findById(id).exec();
    if (zoomClassesReports) {
      //  lesson.grade = data.grade;
      ZoomClassesReport.section = data.section;
      ZoomClassesReport.grade = data.grade;
      ZoomClassesReport.classtittle = data.classtittle;
      ZoomClassesReport.classdate = data.classdate;
      ZoomClassesReport.role = data.role;
      ZoomClassesReport.duration = data.duration;
      ZoomClassesReport.description = data.description;
      // zoomclass.  options=data.options;
      ZoomClassesReport.type = data.type;


      ZoomClassesReport.status = data.status;
      await ZoomClassesReport.save();
    }
    return ZoomClassesReport;
  }

  async query(options = {}): Promise<ZoomClassesReport[]> {
    options = objectDefined(options);
    return this.zoomClassesReports.find(options).populate("section").populate("grade").exec();
  }

  async remove(id: string): Promise<ZoomClassesReport> {
    return await this.zoomClassesReports.findById(id).remove().exec();
  }
}

