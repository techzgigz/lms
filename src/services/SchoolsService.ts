import { Service, Inject, $log } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { School } from "src/models/schools/School";

@Service()
export class SchoolsService {
  @Inject(School) private school: MongooseModel<School>;

  async find(id: string): Promise<School | null> {
    const school = await this.school.findById(id).exec();
    $log.debug("Found school", school);
    return school;
  }

  async save(schoolObj: School): Promise<School> {
    const school = new this.school(schoolObj);
    await school.save();
    $log.debug("Saved school", school);
    return school;
  }

  async update(id: string, schoolObj: School): Promise<School | null> {
    const school = await this.school.findById(id).exec();
    if (school) {
      school.name = schoolObj.name;
      school.domain = schoolObj.domain;
      school.address = schoolObj.address;
      school.branch = schoolObj.branch;
      school.isMainBranch = schoolObj.isMainBranch;
      school.packagedId = schoolObj.packagedId;
      school.status = schoolObj.status;

      await school.save();
      $log.debug("Updated school", school);
      return school;
    }

    return school;
  }

  async query(options = {}): Promise<School[]> {
    return this.school.find(options).exec();
  }

  async remove(id: string): Promise<School> {
    return await this.school.findById(id).remove().exec();
  }
}
