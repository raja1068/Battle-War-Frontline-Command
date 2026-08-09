using UnityEngine;
using System;
using System.Threading.Tasks;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    public UserData CurrentUser { get; private set; }
    public event Action<UserData> OnUserDataUpdated;

    [SerializeField] private APIClient apiClient;
    [SerializeField] private UIManager uiManager;

    private void Awake()
    {
        if (Instance != null) { Destroy(gameObject); return; }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    private void Start()
    {
        string token = PlayerPrefs.GetString("auth_token");
        if (!string.IsNullOrEmpty(token))
        {
            apiClient.SetAuthToken(token);
            LoadUserProfile();
        }
        else
        {
            uiManager.ShowLoginScreen();
        }
    }

    public async void LoadUserProfile()
    {
        var response = await apiClient.GetUserProfile();
        if (response.success)
        {
            CurrentUser = response.data;
            OnUserDataUpdated?.Invoke(CurrentUser);
            uiManager.ShowHomeScreen();
        }
        else
        {
            uiManager.ShowLoginScreen();
        }
    }

    public async void CompleteMission(string missionId, int stars, float timeTaken)
    {
        var response = await apiClient.CompleteMission(missionId, stars, timeTaken);
        if (response.success)
        {
            CurrentUser = response.updatedUser;
            OnUserDataUpdated?.Invoke(CurrentUser);
            uiManager.ShowMissionComplete(response.rewards);
        }
        else
        {
            uiManager.ShowError(response.error);
        }
    }

    // Additional methods: Purchase, Equip, ClaimDaily, etc.
}
