<?php


namespace App\Plugins\TabbedChildEntities\App;

use Illuminate\Database\Eloquent\Model;

use App\Preference;

class TabbedChildEntities extends Model
{    
    protected $table = 'tabbed_child_entities'; // Specify the table name if it's different from the model name

    protected $fillable = [
        'entity_type_id'
    ];   

    // public static function updateData(int $entityId, bool $useTabbedChildren){
    //     if($useTabbedChildren) {
    //         TabbedChildEntities::firstOrCreate([
    //             'entity_type_id' => $entityId
    //         ]);
    //     }else{            
    //         TabbedChildEntities::where('entity_type_id', $entityId)->delete();
    //     }
    // }

    public static function activeIds(array $ids) : array {
        $ids = [];
        info("0");
        $preferences = Preference::getPreferences();
        info("1");
        if(!$preferences || !is_array($preferences) || !isset($preferences['plugin.tabbed_child_entities.preference.entity_type']) ) {
            return $ids;
        }

        info("2");
        $entityTypePreference = $preferences['plugin.tabbed_child_entities.preference.entity_type'];

        info("3");
        info(json_encode($entityTypePreference));
        if($entityTypePreference && isset($entityTypePreference->value) && isset($entityTypePreference->value->entity_types) && count($entityTypePreference->value->entity_types) > 0) {
            $ids = $entityTypePreference->value->entity_types;
            info("4");
        }
        return $ids;
    }


    public static function add(int $entityTypeId) {
        static::firstOrCreate([
            'entity_type_id' => $entityTypeId
        ]);
    }

    public static function remove(int $entityTypeId) {
        static::where('entity_type_id', $entityTypeId)->delete();
    }
}

