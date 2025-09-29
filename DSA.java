class Solution {
    public List<List<Integer>> permuteUnique(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        boolean[] used = new boolean[nums.length];
        solve(nums, res, new ArrayList<>(), used);
        return res;
    }
    public void solve(int[] nums, List<List<Integer>> res, List<Integer> temp, boolean[] used){
        if(temp.size()==nums.length){
            res.add(new ArrayList<>(temp));
            return;
        }
        else{
            for(int i=0; i<nums.length;i++){
                if(used[i]) continue;
                //we will skip, if the previous element is not being used in the current branch
                if(i>0 && used[i-1]==false && nums[i] == nums[i-1]) continue;
            used[i] = true;
            temp.add(nums[i]);
            solve(nums, res, temp, used);
            used[i] = false;
            temp.remove(temp.size()-1);
            }        
        }
    }
}
