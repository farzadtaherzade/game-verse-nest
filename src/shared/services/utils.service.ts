export class UtilsService {
  public static checkValidSLug(slug: string): boolean {
    const regex = new RegExp('/^[a-z0-9]+(?:-[a-z0-9]+)*$/');
    return regex.test(slug);
  }
}
