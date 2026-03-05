import { Page, Locator } from "@playwright/test";

export interface ROCUserData {
  username: string;
  firstName: string;
  lastName: string;
  mobile1: string;
  mobile2: string;
  email: string;
  addressL1: string;
  addressL2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  dob: string;
  gender: string;
  organization: string;
  employeeNumber: string;
}

export class CreateUserPage {
  readonly page: Page;

  readonly rocRadio: Locator;
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
  readonly organization: Locator;
  readonly employeeNumber: Locator;
  readonly orgCertifiedYes: Locator;
  readonly registerBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.rocRadio = page.getByLabel("ROC");

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

    this.organization = page.getByRole("textbox", { name: /Organization/i });
    this.employeeNumber = page.getByRole("textbox", {
      name: /Employee Number/i,
    });
    this.orgCertifiedYes = page.getByLabel("Yes", { exact: true });

    this.registerBtn = page.getByRole("button", { name: /Register/i });
  }

  async selectROCRole() {
    await this.rocRadio.check();
  }

  async fillCommonDetails(data: ROCUserData) {
    await this.username.fill(data.username);
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.mobileNumber1.fill(data.mobile1);
    await this.mobileNumber2.fill(data.mobile2);
    await this.email.fill(data.email);
    await this.addressL1.fill(data.addressL1);
    await this.addressL2.fill(data.addressL2);
    await this.city.fill(data.city);
    await this.state.fill(data.state);

    // Country selection as in your original code
    await this.country.click();
    await this.country.fill(data.country);
    const countryListbox = this.page
      .getByRole("listbox", { exact: true })
      .filter({ hasText: data.country })
      .first();
    await countryListbox.waitFor({ state: "visible", timeout: 5000 });
    await countryListbox
      .getByRole("option", { name: data.country, exact: true })
      .click();

    await this.pincode.fill(data.pincode);
    await this.dob.fill(data.dob);

    // Gender selection as in your original code
    await this.genderCombo.click();
    await this.page
      .getByRole("option", { name: new RegExp(`^${data.gender}$`, "i") })
      .click();
  }

  async fillROCSpecificDetails(data: ROCUserData) {
    await this.organization.fill(data.organization);
    await this.employeeNumber.fill(data.employeeNumber);
    await this.orgCertifiedYes.check();
  }

  async submit(): Promise<void> {
    await this.registerBtn.click();

    // Check for validation errors (e.g., required fields)
    const validationMessages = this.page.getByText(/.+ is required$/, {
      exact: false,
    });
    if ((await validationMessages.count()) > 0) {
      const messages = [];
      const count = await validationMessages.count();
      for (let i = 0; i < count; i++) {
        messages.push(await validationMessages.nth(i).textContent());
      }
      throw new Error(`Validation errors: ${messages.join("; ")}`);
    }

    // Wait for network idle
    await this.page.waitForLoadState("networkidle");
  }

  async createROCUser(data: ROCUserData) {
    await this.selectROCRole();
    await this.fillCommonDetails(data);
    await this.fillROCSpecificDetails(data);

    try {
      await this.submit();
    } catch (err) {
      await this.page.screenshot({
        path: `logs/${data.username}_validation_error.png`,
        fullPage: true,
      });
      throw err; // rethrow to let test skip table validation
    }
  }
}
