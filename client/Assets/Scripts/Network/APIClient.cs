using UnityEngine;
using UnityEngine.Networking;
using System.Threading.Tasks;
using System;

[Serializable]
public class APIResponse<T>
{
    public bool success;
    public string error;
    public T data;
}

[Serializable]
public class UserData
{
    public string id;
    public string displayName;
    public int level;
    public int xp;
    public int coins;
    public int premiumCurrency;
    public InventoryItem[] inventory;
    // ... more fields
}

public class APIClient : MonoBehaviour
{
    [SerializeField] private string baseURL = "https://api.battlewar.example.com";
    private string authToken;

    public void SetAuthToken(string token) => authToken = token;

    public async Task<APIResponse<UserData>> GetUserProfile()
    {
        using var request = UnityWebRequest.Get(baseURL + "/api/user/profile");
        request.SetRequestHeader("Authorization", "Bearer " + authToken);
        var operation = request.SendWebRequest();
        while (!operation.isDone) await Task.Yield();
        if (request.result != UnityWebRequest.Result.Success)
            return new APIResponse<UserData> { success = false, error = request.error };
        var json = request.downloadHandler.text;
        return JsonUtility.FromJson<APIResponse<UserData>>(json);
    }

    public async Task<APIResponse<MissionCompleteResponse>> CompleteMission(string missionId, int stars, float time)
    {
        var jsonBody = JsonUtility.ToJson(new { missionId, stars, time });
        using var request = UnityWebRequest.Post(baseURL + "/api/missions/complete", jsonBody, "application/json");
        request.SetRequestHeader("Authorization", "Bearer " + authToken);
        var operation = request.SendWebRequest();
        while (!operation.isDone) await Task.Yield();
        if (request.result != UnityWebRequest.Result.Success)
            return new APIResponse<MissionCompleteResponse> { success = false, error = request.error };
        var json = request.downloadHandler.text;
        return JsonUtility.FromJson<APIResponse<MissionCompleteResponse>>(json);
    }

    // Additional endpoints: Login, Register, Buy, Equip, Daily, etc.
}
