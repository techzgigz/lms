import { Model, ObjectID, Ref, Trim } from "@tsed/mongoose";
import {
    Default,
    Enum,
    Groups,
    MaxLength,
    MinLength,
    Property,
    Required,
    Format
} from "@tsed/schema";
import { Medium } from "../mediums/Medium";
import { Grade } from "../grades/Grades";
import { Subject } from "../subjects/Subject"
import { User } from "../users/User";

import { Section } from "../sections/Section";
@Model({ schemaOptions: { timestamps: true } })
export class Content {
    @Groups("!creation", "!updation")
    @ObjectID("id")
    _id: string;



    @Property()
    @Required()
    contentTittle: string;


    @Property()
    @Required()
    contentType: string;

    @Property()
    //@Required()
    avilableFor: [];

    @Property()
    //@Required()
    class: [];

    @Ref(Section)
    @Required()
    lesson: Ref<Section>;


    @Property()
    @Required()
    file: string;

    @Property()
    @Required()
    downloadlink: string;

    @Format("date-time")
    @Default(Date.now)
    uploadDate: Date = new Date();

    @Property()
    @Required()
    teacherId: string;

    @Property()
    @Enum("active", "inactive")
    @Default("active")
    status: string;

    @Ref(User)
  @Groups("!updation")
  createdBy: Ref<User>;

}
