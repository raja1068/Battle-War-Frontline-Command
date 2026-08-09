using UnityEngine;

public abstract class Vehicle : MonoBehaviour
{
    public VehicleData vehicleData;
    protected float currentHealth;
    protected float currentArmour;
    public bool isDestroyed { get; protected set; }

    public virtual void Initialize(VehicleData data)
    {
        vehicleData = data;
        currentHealth = data.health;
        currentArmour = data.armour;
    }

    public virtual void TakeDamage(float damage)
    {
        currentHealth -= damage * (1 - currentArmour / (currentArmour + 100));
        if (currentHealth <= 0) DestroyVehicle();
    }

    public virtual void DestroyVehicle()
    {
        isDestroyed = true;
        // Effects and disable
    }

    public abstract void Move(Vector3 direction);
    public abstract void FirePrimary();
}
