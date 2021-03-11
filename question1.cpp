#include <bits/stdc++.h>
using namespace std;

void printRepeating(int arr[], int size)
{
	int i;
	for (i = 0; i < size; i++) {
		if (arr[abs(arr[i])] >= 0)
			arr[abs(arr[i])] = -arr[abs(arr[i])];
		else
			cout << abs(arr[i]) << " ";
	}
}


int main()
{
    int n;
    cin>>n;
    int arr[n];
    for(int i=0;i<n;i++)
    {
        cin>>arr[i];
    }
	int arr_size = sizeof(arr) / sizeof(arr[0]);
	printRepeating(arr, arr_size);
	return 0;
}