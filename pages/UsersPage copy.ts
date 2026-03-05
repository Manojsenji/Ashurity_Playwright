import { Page, Locator, expect } from "@playwright/test";
import { logger } from "../utils/logger";

export type UserRole = "ROC" | "SOC" | "DOCTOR";

export type CreateUserPayload = {
  username: string;
  password: string;
  role: UserRole;
};

export class UsersPage {
  readonly page: Page;

  // Navigation
  readonly roleManagement: Locator;
  readonly createAccountBtn: Locator;

  // Role Selection
  readonly rocRadio: Locator;
  readonly socRadio: Locator;
  readonly doctorRadio: Locator;

  // Common Fields
  readonly username: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly mobileNumber1: Locator;
  readonly mobileNumber2: Locator;
  readonly email: Locator;
  readonly addressL1: Locator;
  readonly addressL2: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly country: Locator;
  readonly pincode: Locator;
  readonly dob: Locator;
  readonly genderCombo: Locator;

  // ROC Fields
  readonly organization: Locator;
  readonly employeeNumber: Locator;
  readonly orgCertifiedYes: Locator;

  // Doctor Fields
  readonly qualification: Locator;
  readonly hospital: Locator;
  readonly specialization: Locator;
  readonly registrationNumber: Locator;

  // Actions
  readonly registerBtn: Locator;

  // SOC Popup
  readonly kithKinModal: Locator;
  readonly addKithAndKinBtn: Locator;
  readonly cancelKithAndKinBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.roleManagement = page.getByRole("link", { name: "Role Management" });
    this.createAccountBtn = page.getByRole("button", {
      name: "Create Account",
    });

    // Role selection
    this.rocRadio = page.getByLabel("ROC");
    this.socRadio = page.getByLabel("SOC");
    this.doctorRadio = page.getByLabel("Doctor");

    // Common fields
    this.username = page.getByRole("textbox", { name: /User Name/i });
    this.firstName = page.getByRole("textbox", { name: /First Name/i });
    this.lastName = page.getByRole("textbox", { name: /Last Name/i });
    this.mobileNumber1 = page
      .getByRole("textbox", { name: "1 (702) 123-4567" })
      .nth(0);
    this.mobileNumber2 = page
      .getByRole("textbox", { name: "1 (702) 123-4567" })
      .nth(1);
    this.email = page.getByRole("textbox", { name: /Email ID/i });
    this.addressL1 = page.getByRole("textbox", { name: /Address Line1/i });
    this.addressL2 = page.getByRole("textbox", { name: /Address Line2/i });
    this.city = page.getByRole("textbox", { name: /City/i });
    this.state = page.getByRole("textbox", { name: /State/i });
    this.country = page.getByRole("combobox", { name: /Country/i });
    this.pincode = page.getByRole("textbox", { name: /Pin code/i });
    this.dob = page.getByRole("textbox", { name: /Date Of Birth/i });
    this.genderCombo = page.getByRole("combobox", { name: /Gender/i });

    // ROC fields
    this.organization = page.getByRole("textbox", { name: /Organization/i });
    this.employeeNumber = page.getByRole("textbox", {
      name: /Employee Number/i,
    });
    this.orgCertifiedYes = page.getByLabel("Yes", { exact: true });

    // Doctor fields
    this.qualification = page.getByRole("textbox", { name: /Qualification/i });
    this.hospital = page.getByRole("textbox", { name: /Hospital/i });
    this.specialization = page.getByRole("textbox", {
      name: /Specialization/i,
    });
    this.registrationNumber = page.getByRole("textbox", {
      name: /Registration Number/i,
    });

    // Actions
    this.registerBtn = page.getByRole("button", { name: /Register/i });

    // SOC popup
    this.kithKinModal = page.getByRole("dialog");
    this.addKithAndKinBtn = this.kithKinModal.getByRole("button", {
      name: /Yes/i,
    });
    this.cancelKithAndKinBtn = this.kithKinModal.getByRole("button", {
      name: /No/i,
    });
  }

  // -------------------------
  // Public Methods
  // -------------------------

  async createUser(data: CreateUserPayload) {
    await this.navigateToCreateUser();
    await this.selectRole(data.role);
    await this.fillCommonDetails(data.username);

    switch (data.role) {
      case "ROC":
        await this.fillRocDetails();
        break;
      case "DOCTOR":
        await this.fillDoctorDetails();
        break;
      case "SOC":
        // no extra fields
        break;
    }

    await this.registerBtn.click();

    if (data.role === "SOC") {
      await this.handleSocPopup("cancel"); // configurable
    }

    logger.info(`${data.role} user created successfully`);
  }

  // async logout() {
  //   const logoutBtn = this.page
  //     .getByRole("button", { name: /Logout/i })
  //     .first();
  //   await logoutBtn.click();
  //   await this.page.waitForURL(/login/);
  // }

  // -------------------------
  // Private Helpers
  // -------------------------

  private async navigateToCreateUser() {
    await this.roleManagement.click();
    await this.createAccountBtn.click();
  }

  private async selectRole(role: UserRole) {
    logger.info(`Selecting role: ${role}`);

    switch (role) {
      case "ROC":
        await this.rocRadio.check();
        break;
      case "SOC":
        await this.socRadio.check();
        break;
      case "DOCTOR":
        await this.doctorRadio.check();
        break;
    }
  }

  private async fillCommonDetails(username: string) {
    await this.username.fill(username);
    await this.firstName.fill("Test");
    await this.lastName.fill("User");

    await this.mobileNumber1.fill("9876543210");
    //await this.mobileNumber2.fill("9876543211");

    await this.email.fill(`${username}@mail.com`);

    await this.addressL1.fill("Address Line 1");
    await this.addressL2.fill("Address Line 2");
    await this.city.fill("Bangalore");
    await this.state.fill("Karnataka");

    // Click Country field
    await this.country.click();
    await this.country.fill("India");

    // Wait for autocomplete options
    const countryListbox = this.page
      .getByRole("listbox", { exact: true })
      .filter({ hasText: "India" })
      .first();
    await countryListbox.waitFor({ state: "visible", timeout: 5000 });

    // Click exact 'India' option
    await countryListbox
      .getByRole("option", { name: "India", exact: true })
      .click();

    await this.pincode.fill("560001");

    // Open Gender combobox
    await this.page.getByRole("combobox", { name: /Gender/i }).click();

    // Click the exact visible option
    await this.page
      .locator('li[role="option"]:has-text("Male")')
      .first()
      .click();

    await this.dob.fill("1995-01-01");
  }

  private async fillRocDetails() {
    await this.mobileNumber2.fill("9876543211");
    await this.organization.fill("Ashurity Labs");
    await this.employeeNumber.fill(`EMP${Date.now()}`);
    await this.orgCertifiedYes.check();
  }

  private async fillDoctorDetails() {
    await this.mobileNumber2.fill("9876543211");
    await this.qualification.fill("MBBS");
    await this.hospital.fill("Apollo Hospital");
    await this.specialization.fill("Cardiology");
    await this.registrationNumber.fill(`REG${Date.now()}`);
  }

  private async handleSocPopup(action: "add" | "cancel") {
    await this.kithKinModal.waitFor({ state: "visible", timeout: 5000 });

    logger.info(`Handling SOC popup: ${action}`);

    if (action === "add") {
      await this.addKithAndKinBtn.click();
    } else {
      await this.cancelKithAndKinBtn.click();
    }

    await this.kithKinModal.waitFor({ state: "hidden" });
  }
}
