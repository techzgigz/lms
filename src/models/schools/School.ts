import {
  Indexed,
  Model,
  ObjectID,
  Ref,
  Schema,
  Trim,
  Unique,
} from "@tsed/mongoose";
import {
  Default,
  Enum,
  Format,
  Groups,
  MaxLength,
  MinLength,
  Optional,
  Pattern,
  Property,
  Required,
} from "@tsed/schema";
import { Package } from "../packages/Package";
import { Address } from "../users/Address";
import { User } from "../users/User";

@Model({ schemaOptions: { timestamps: true } })
export class School {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

  @Required()
  @MinLength(3)
  @MaxLength(100)
  @Trim()
  name: string;

  @Indexed()
  @Required()
  @Format("hostname")
  @Unique()
  domain: string;

  @Property()
  @Required()
  address: Address;

  @Property()
  @Required()
  @Pattern(/^[6-9]\d{9}$/)
  phoneNumber: number;

  @Enum("multi", "single")
  @Default("single")
  branch: string;

  @Property()
  @Default(false)
  isMainBranch: boolean;

  @Ref(() => School)
  mainBranch: Ref<School>;

  @Ref(Package)
  @Required()
  package: Ref<Package>;

  @Ref(User)
  @Groups("!creation", "!updation")
  createdBy?: Ref<User>;

  adminId?: string

  @Enum("active", "inactive", "suspended", "blocked")
  @Default("active")
  status: string;
}
