using UnityEngine;
using System.Collections;

public class WeaponManager : MonoBehaviour
{
    public WeaponData currentWeaponData;
    private Weapon currentWeaponInstance;
    private int currentAmmo;
    private bool isReloading;

    public void EquipWeapon(WeaponData data)
    {
        if (currentWeaponInstance) Destroy(currentWeaponInstance.gameObject);
        currentWeaponData = data;
        currentWeaponInstance = Instantiate(data.prefab, weaponMount);
        currentAmmo = data.magazineSize;
    }

    public void Fire()
    {
        if (isReloading || currentAmmo <= 0 || !currentWeaponData) return;
        // Spawn projectile, play effects
        currentAmmo--;
        // If magazine empty, auto-reload
        if (currentAmmo == 0) Reload();
    }

    public void Reload()
    {
        if (isReloading || currentAmmo == currentWeaponData.magazineSize) return;
        StartCoroutine(ReloadCoroutine());
    }

    private IEnumerator ReloadCoroutine()
    {
        isReloading = true;
        yield return new WaitForSeconds(currentWeaponData.reloadTime);
        currentAmmo = currentWeaponData.magazineSize;
        isReloading = false;
    }
}
